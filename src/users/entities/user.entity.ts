import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { RolesEnum } from 'src/constants';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    @ApiProperty()
    @Transform(({ value }) => value.toString())
    // @Exclude()
    // @Prop({ type: SchemaTypes.ObjectId })
    _id: string;

    // @Expose()
    // get id(): String { return this._id ? `${this._id}` : undefined }

    @ApiProperty()
    @Prop()
    firstName: string;

    @ApiProperty()
    @Prop()
    lastName: string;

    @ApiProperty()
    @Prop({ unique: true })
    email: string;

    @ApiProperty({enum: RolesEnum})
    @Prop()
    role: RolesEnum

    @Prop()
    @Exclude()
    password: string;

    @Prop()
    @Exclude()
    __v: number;

    @Prop({select: false})
    refreshToken: string;

    validatePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }

};

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

UserSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10);
})