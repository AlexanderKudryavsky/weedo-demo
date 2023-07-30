import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from "mongoose";
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from 'src/helpers/constants';
import { Store } from "../../stores/entities/store.entity";
import { Cart } from "../../cart/entities/cart.entity";

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
class UserFullAddressSchema {

    @ApiProperty()
    @Prop({type: mongoose.Schema.Types.String})
    country: string;

    @ApiProperty()
    @Prop({type: mongoose.Schema.Types.String})
    city: string;

    @ApiProperty()
    @Prop({type: mongoose.Schema.Types.String})
    street: string;

    @ApiProperty()
    @Prop({type: mongoose.Schema.Types.String})
    house: string;

    @ApiProperty()
    @Prop({type: mongoose.Schema.Types.String})
    apartment: string;

    @ApiProperty()
    @Prop({type: mongoose.Schema.Types.String})
    postalCode: string;
}

@Schema({ _id: false })
class UserLocationSchema {

    @ApiProperty({default: 'Point'})
    @Prop({type: mongoose.Schema.Types.String, default: 'Point'})
    type: 'Point';

    @ApiProperty({type: Number, isArray: true})
    @Prop({type: [{ type: mongoose.Schema.Types.Number }]})
    coordinates: Array<number>;
}

@Schema({ _id: false })
class UserAddressSchema {

    @ApiProperty()
    @Prop({type: UserFullAddressSchema})
    fullAddress: UserFullAddressSchema;

    @ApiProperty()
    @Prop({type: UserLocationSchema})
    location: UserLocationSchema;
}

@Schema({ timestamps: true})
export class User {

    @ApiProperty()
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
    @Prop({ type: UserAddressSchema })
    address: UserAddressSchema;

    @ApiProperty()
    @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: Store.name}]})
    favoritesStores: Array<Store>

    @ApiProperty({enum: RolesEnum})
    @Prop({type: mongoose.Schema.Types.String, enum: RolesEnum})
    role: RolesEnum

    @ApiProperty()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart'})
    currentCart: string;

    @Prop({type: mongoose.Schema.Types.String})
    password: string;

    @Prop()
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
};

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

UserSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 10);
})

UserSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['password']
        return ret
    }
})

UserSchema.index({
    'address.location': '2dsphere',
})