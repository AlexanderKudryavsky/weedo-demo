import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from 'src/constants';
import { JwtStrategy } from './jwt-strategy';
import { JwtRefreshTokenStrategy } from './refresh-jwt-strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: jwtSecret,
            signOptions: {
                expiresIn: '15m'
            },
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        JwtRefreshTokenStrategy,
    ],
    exports: [
        JwtStrategy,
        JwtRefreshTokenStrategy,
        PassportModule
    ]

})
export class AuthModule { }
