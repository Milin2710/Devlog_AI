import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Authentication } from './user.entity';
import * as bcrypt from 'bcrypt';
import { BlacklistedToken } from './blacklisted-token.entity';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authentication)
    private userRepository: Repository<Authentication>,
    @InjectRepository(BlacklistedToken)
    private blacklistRepository: Repository<BlacklistedToken>,
    private jwtService: JwtService,
  ) {}

  async signup(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return user;
  }

  async blacklistToken(token: string): Promise<void> {
    const blacklistedToken = this.blacklistRepository.create({
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.blacklistRepository.save(blacklistedToken);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    // Create a more comprehensive payload
    const payload = {
      email: user.email,
      uuid: user.uuid,
      first_name: user.first_name,
      last_name: user.last_name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        email: user.email,
        uuid: user.uuid,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  }

  // async forgotPassword(email: string): Promise<string> {
  //   const user = await this.userRepository.findOne({ where: { email } });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   // Generate token
  //   const token = crypto.randomBytes(32).toString('hex');
  //   const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  //   // Save token & expiry to DB
  //   user.resetToken = token;
  //   user.resetTokenExpiry = expiry;
  //   await this.userRepository.save(user);

  //   const resetUrl = `https://devlog-ai.vercel.app/reset-password/${token}`;

  //   // Send email
  //   const transporter = nodemailer.createTransport({
  //     service: 'gmail', // or use your SMTP service
  //     auth: {
  //       user: process.env.EMAIL_FROM,
  //       pass: process.env.EMAIL_PASS,
  //     },
  //   });

  //   const mailOptions = {
  //     from: `"DEVLOG AI" <${process.env.EMAIL_FROM}>`,
  //     to: user.email,
  //     subject: 'Reset your DEVLOG AI password',
  //     html: `
  //       <p>You requested to reset your password.</p>
  //       <p>Click the link below to reset it. This link is valid for 30 minutes.</p>
  //       <a href="${resetUrl}">${resetUrl}</a>
  //       <p>If you didn't request this, ignore this email.</p>
  //     `,
  //   };

  //   await transporter.sendMail(mailOptions);

  //   return 'Password reset link sent';
  // }
}
