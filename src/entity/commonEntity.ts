import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class CommonEntity {
  @CreateDateColumn({ type: 'timestamp' })
  public createdOn!: Date

  @UpdateDateColumn({ type: 'timestamp' })
  public modifiedOn!: Date

  @DeleteDateColumn({ type: 'timestamp' })
  public deletedOn!: Date
}