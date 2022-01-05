import { JwtService } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';

import { InvalidCredentialsException } from '../../../src/auth/exceptions/invalid-credentials-exception';
import { SignIn } from '../../../src/auth/use-cases/sign-in';
import { ValidateUser } from '../../../src/users/use-cases/validate-user';

describe('SignIn', () => {
  const mockValidateUser = mock<ValidateUser>();
  const mockJwtService = mock<JwtService>();
  const sut = new SignIn(mockJwtService, mockValidateUser);

  const mockUser = {
    userId: '8c9746c2-9ef6-4908-9e67-a4211d6557c2',
    email: 'teste@sof.to',
    name: 'Teste',
    password: '$2b$10$NiCWm3MxS0Me2P.atEB9/.HRxjsRHEu57gS8mTpGY0ZnlNKRbj/kO',
    createdAt: new Date('2022-01-03T16:48:04.868'),
    updatedAt: new Date('2022-01-03T16:48:04.868'),
    hasId: null,
    remove: null,
    save: null,
    softRemove: null,
    reload: null,
    recover: null,
  };

  const jwtToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYWZiY2EzYy04Y2VmLTQ1YzgtYjJkZS1lNzBjOWY1OGMyYjMiLCJlbWFpbCI6InRlc3RlQHNvZi50byIsImlhdCI6MTY0MTMwNDYzMSwiZXhwIjoxNjQxMzA1NTMxfQ.o1w0aLTNGbij1tS9nHWkbvgUU6HH1hIQ1gwda2NlH6A';

  const params = { email: 'teste@sof.to', password: 'teste' };

  it('should throw InvalidCredentialsException if credentials are invalid', async () => {
    mockValidateUser.execute.mockResolvedValueOnce(null);
    await expect(sut.execute(params)).rejects.toThrow(InvalidCredentialsException);
    expect(mockValidateUser.execute).toHaveBeenCalledWith({
      email: params.email,
      password: params.password,
    });
  });

  it('should sign-in if everything is correct', async () => {
    mockValidateUser.execute.mockResolvedValueOnce(mockUser);
    mockJwtService.sign.mockReturnValueOnce(jwtToken);
    await expect(sut.execute(params)).resolves.toStrictEqual({ accessToken: jwtToken });
    expect(mockValidateUser.execute).toHaveBeenCalledWith({
      email: params.email,
      password: params.password,
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      userId: mockUser.userId,
      email: mockUser.email,
    });
  });
});
