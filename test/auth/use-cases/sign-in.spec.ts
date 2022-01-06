import { JwtService } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';

import { SignIn } from '../../../src/auth/use-cases/sign-in';
import { ValidateUser } from '../../../src/users/use-cases/validate-user';
import { UserEntityGenerator } from '../../users/generator/user-entity.generator';

describe('SignIn', () => {
  const mockValidateUser = mock<ValidateUser>();
  const mockJwtService = mock<JwtService>();
  const sut = new SignIn(mockJwtService, mockValidateUser);

  const jwtToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYWZiY2EzYy04Y2VmLTQ1YzgtYjJkZS1lNzBjOWY1OGMyYjMiLCJlbWFpbCI6InRlc3RlQHNvZi50byIsImlhdCI6MTY0MTMwNDYzMSwiZXhwIjoxNjQxMzA1NTMxfQ.o1w0aLTNGbij1tS9nHWkbvgUU6HH1hIQ1gwda2NlH6A';

  it('should sign-in if everything is correct', async () => {
    const { item: user } = UserEntityGenerator.generate();
    const params = { email: user.email, password: user.password };
    mockValidateUser.execute.mockResolvedValueOnce(user);
    mockJwtService.sign.mockReturnValueOnce(jwtToken);
    await expect(sut.execute(params)).resolves.toStrictEqual({ accessToken: jwtToken });
    expect(mockValidateUser.execute).toHaveBeenCalledWith({
      email: params.email,
      password: params.password,
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
    });
  });
});
