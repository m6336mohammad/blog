import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
     register() {
    return { message: 'registered succed' };
  }
     login() {
    return { message: 'login succed' };
  }
}
