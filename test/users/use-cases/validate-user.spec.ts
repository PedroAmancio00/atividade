import { mock } from 'jest-mock-extended';

import { ValidatePassword } from '../../../src/users/use-cases/validate-password';
import { ValidateUser } from '../../../src/users/use-cases/validate-user';
import { UserRepository } from '../../../src/users/users.repository';

describe('ValidateUser', () => {
  const mockUserRepository = mock<UserRepository>();
  const mockValidatePassword = mock<ValidatePassword>();
  const sut = new ValidateUser(mockUserRepository, mockValidatePassword);

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

  const params = { email: 'teste@sof.to', password: 'teste' };

  it('should throw InvalidCredentialsException if email is not found', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(null);
    await expect(sut.execute(params)).resolves.toBe(null);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      email: params.email,
    });
  });

  it('should throw InvalidCredentialsException if password does not match', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
    mockValidatePassword.execute.mockResolvedValueOnce(false);
    await expect(sut.execute(params)).resolves.toBe(null);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      email: params.email,
    });
    expect(mockValidatePassword.execute).toHaveBeenCalledWith({
      password: params.password,
      hash: mockUser.password,
    });
  });

  it('should validate user if everything is correct', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
    mockValidatePassword.execute.mockResolvedValueOnce(true);
    await expect(sut.execute(params)).resolves.toBe(mockUser);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      email: params.email,
    });
    expect(mockValidatePassword.execute).toHaveBeenCalledWith({
      password: params.password,
      hash: mockUser.password,
    });
  });
});
