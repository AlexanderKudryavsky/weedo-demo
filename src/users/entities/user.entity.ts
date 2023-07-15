import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { RolesEnum } from 'src/constants';
import { Store } from "../../stores/entities/store.entity";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true})
export class User {

    @ApiProperty()
    @Transform(({ value }) => {
        console.log(12121212, value);
        return value.toString()
    })
    _id: string;

    @ApiProperty()
    @Prop({type: mongoose.Schema.Types.String})
    firstName: string;

    @ApiProperty()
    @Prop({type: mongoose.Schema.Types.String})
    lastName: string;

    @ApiProperty()
    @Prop({ unique: true, type: mongoose.Schema.Types.String })
    email: string;

    @ApiProperty()
    @Prop({ unique: true, type: mongoose.Schema.Types.String })
    phone: string;

    @ApiProperty()
    @Prop()
    location: string;

    @ApiProperty()
    @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store'}]})
    favoritesStores: Array<Store>

    @ApiProperty({enum: RolesEnum})
    @Prop({type: mongoose.Schema.Types.String})
    role: RolesEnum

    @Prop({type: mongoose.Schema.Types.String})
    @Exclude({toPlainOnly: true})
    password: string;

    @Prop()
    @Exclude()
    __v: number;

    @Prop({select: false, type: mongoose.Schema.Types.String})
    refreshToken: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

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