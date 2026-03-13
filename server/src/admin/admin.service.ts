import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Authentication } from '../auth/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { JournalEntry } from '../journal/journal.entity';
import { Logs } from '../logs/logs.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Authentication)
    private userRepository: Repository<Authentication>,
    @InjectRepository(JournalEntry)
    private journalRepository: Repository<JournalEntry>,
    @InjectRepository(Logs)
    private logsRepository: Repository<Logs>,
  ) {}

  async getAllUsers() {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('journal', 'entry', 'entry.author_uuid = user.uuid')
      .select([
        'user.id',
        'user.first_name',
        'user.last_name',
        'user.email',
        'user.created_at',
        'user.updated_at',
      ])
      .addSelect('COUNT(entry.id)', 'entry_count')
      .groupBy('user.id')
      .addGroupBy('user.first_name')
      .addGroupBy('user.last_name')
      .addGroupBy('user.email')
      .addGroupBy('user.created_at')
      .addGroupBy('user.updated_at')
      .getRawMany();
  }

  async getTimelineData() {
    const entries = await this.journalRepository
      .createQueryBuilder('entry')
      .select("DATE_TRUNC('day', entry.created_at)", 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    // Create a map of date to count
    const dataMap = new Map<string, number>();
    entries.forEach((e) => {
      const dateStr = e.date.toISOString().split('T')[0];
      dataMap.set(dateStr, parseInt(e.count, 10));
    });

    // Generate last 30 days
    const timelineData: { date: string; count: number }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;
      timelineData.push({ date: dateStr, count });
    }

    return timelineData;
  }

  async getTopTags() {
    const result = await this.journalRepository
      .createQueryBuilder('entry')
      .select('unnest(entry.journal_tags)', 'tag')
      .addSelect('COUNT(*)', 'count')
      .groupBy('tag')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const topTags = result.map((r) => ({
      tag: r.tag,
      count: parseInt(r.count, 10),
    }));

    return topTags;
  }

  async getTagsData() {
    const result = await this.journalRepository
      .createQueryBuilder('entry')
      .select('COUNT(DISTINCT tag)', 'count')
      .from(
        (qb) =>
          qb
            .select('unnest(entry.journal_tags)', 'tag')
            .from('journal', 'entry'),
        'tags',
      )
      .getRawOne<{ count: string }>();

    return Number(result?.count ?? '0');
  }

  async getUsersData() {
    const result = await this.journalRepository
      .createQueryBuilder('entry')
      .select('entry.author_uuid', 'uuid')
      .addSelect('entry.author_first_name', 'first_name')
      .addSelect('entry.author_last_name', 'last_name')
      .addSelect('COUNT(*)', 'count')
      .groupBy('entry.author_uuid')
      .addGroupBy('entry.author_first_name')
      .addGroupBy('entry.author_last_name')
      .getRawMany();

    const topUsers = result
      .sort((a, b) => parseInt(b.count, 10) - parseInt(a.count, 10))
      .slice(0, 10);

    return topUsers.map((u) => ({
      user: u.uuid,
      username: `${u.first_name} ${u.last_name}`,
      entries: parseInt(u.count, 10),
    }));
  }

  async getStatsData() {
    const totalUsers = await this.userRepository
      .createQueryBuilder('user')
      .select('COUNT(*)', 'count')
      .getRawOne<{ count: string }>();

    const totalEntries = await this.journalRepository.count();

    const totalTags = await this.getTagsData();

    const entriesthisMonth = await this.journalRepository
      .createQueryBuilder('entry')
      .select('COUNT(*)', 'count')
      .where("entry.created_at >= NOW() - INTERVAL '30 days'")
      .getRawOne<{ count: string }>();

    const activeUsers = await this.journalRepository
      .createQueryBuilder('entry')
      .select('DISTINCT entry.author_uuid', 'uuid')
      .where("entry.created_at >= NOW() - INTERVAL '30 days'")
      .getRawMany();

    return {
      totalUsers: Number(totalUsers?.count ?? '0'),
      totalEntries,
      totalTags,
      activeUsers: activeUsers.length,
      entriesthisMonth: Number(entriesthisMonth?.count ?? '0'),
    };
  }

  async getActivityLogs(page: number = 1, limit: number = 20) {
    const [logs, total] = await this.logsRepository.findAndCount({
      order: { created_at: 'DESC', id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
