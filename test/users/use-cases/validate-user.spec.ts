import { mock } from 'jest-mock-extended';
import { InvalidCredentialsException } from '../../../src/users/exceptions/invalid-credentials-exception';

import { ValidatePassword } from '../../../src/users/use-cases/validate-password';
import { ValidateUser } from '../../../src/users/use-cases/validate-user';
import { UserRepository } from '../../../src/users/users.repository';
import { UserEntityGenerator } from '../generator/user-entity.generator';

describe('ValidateUser', () => {
  const mockUserRepository = mock<UserRepository>();
  const mockValidatePassword = mock<ValidatePassword>();
  const sut = new ValidateUser(mockUserRepository, mockValidatePassword);
  const { item: user } = UserEntityGenerator.generate();

  const params = { email: 'teste@sof.to', password: 'teste' };

  it('should throw InvalidCredentialsException if email is not found', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(null);
    await expect(sut.execute(params)).rejects.toThrow(InvalidCredentialsException);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      email: params.email,
    });
  });

  it('should throw InvalidCredentialsException if password does not match', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(user);
    mockValidatePassword.execute.mockResolvedValueOnce(false);
    await expect(sut.execute(params)).rejects.toThrow(InvalidCredentialsException);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      email: params.email,
    });
    expect(mockValidatePassword.execute).toHaveBeenCalledWith({
      password: params.password,
      hash: user.password,
    });
  });

  it('should validate user if everything is correct', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(user);
    mockValidatePassword.execute.mockResolvedValueOnce(true);
    await expect(sut.execute(params)).resolves.toBe(user);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      email: params.email,
    });
    expect(mockValidatePassword.execute).toHaveBeenCalledWith({
      password: params.password,
      hash: user.password,
    });
  });
});
