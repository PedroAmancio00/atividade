import { mock } from 'jest-mock-extended';

import { EmailAlreadyExistsException } from '../../../src/users/exceptions/email-already-exists';
import { CreateUser } from '../../../src/users/use-cases/create-user';
import { HashPassword } from '../../../src/users/use-cases/hash-password';
import { UserRepository } from '../../../src/users/users.repository';

describe('CreateUser', () => {
  const mockUserRepository = mock<UserRepository>();
  const mockHashPassword = mock<HashPassword>();
  const sut = new CreateUser(mockUserRepository, mockHashPassword);

  const hashPassword = '$2b$10$NiCWm3MxS0Me2P.atEB9/.HRxjsRHEu57gS8mTpGY0ZnlNKRbj/kO';

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

  const params = { email: 'teste@sof.to', name: 'teste', password: 'teste' };

  it('should throw EmailConflictException if email is already registered', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
    await expect(sut.execute(params)).rejects.toThrow(EmailAlreadyExistsException);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      email: params.email,
    });
  });

  it('should register user if everything is correct', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(null);
    mockUserRepository.save.mockResolvedValueOnce(mockUser);
    mockHashPassword.execute.mockResolvedValueOnce(hashPassword);
    await expect(sut.execute(params)).resolves.toStrictEqual({ message: 'User created' });
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      email: params.email,
    });
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      email: params.email,
      name: params.name,
      password: hashPassword,
    });
  });
});
