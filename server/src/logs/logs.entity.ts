import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("logs")
export class Logs {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", nullable: true })
  user_uuid: string;

  @Column({ type: "text", nullable: true })
  user_email: string;

  @Column({ type: "text" })
  action: string;

  @Column({ type: "text", nullable: true })
  service: string;

  @Column({ type: "text", nullable: true })
  endpoint: string;

  @Column({ type: "text", nullable: true })
  method: string;

  @Column({ type: "text", nullable: true })
  ip_address: string;

  @Column({ type: "text", nullable: true })
  user_agent: string;

  @Column({ type: "jsonb", nullable: true })
  request_body: any;

  @Column({ type: "jsonb", nullable: true })
  response_body: any;

  @Column({ type: "jsonb", nullable: true })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;
}