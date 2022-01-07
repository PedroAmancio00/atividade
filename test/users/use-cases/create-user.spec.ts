import { mock } from 'jest-mock-extended';

import { EmailAlreadyExistsException } from '../../../src/users/exceptions/email-already-exists';
import { CreateUser } from '../../../src/users/use-cases/create-user';
import { HashPassword } from '../../../src/users/use-cases/hash-password';
import { UserRepository } from '../../../src/users/users.repository';
import { CreateUserDtoGenerator } from '../generator/create-user-dto.generator';
import { UserEntityGenerator } from '../generator/user-entity.generator';

describe('CreateUser', () => {
  const mockUserRepository = mock<UserRepository>();
  const mockHashPassword = mock<HashPassword>();
  const sut = new CreateUser(mockUserRepository, mockHashPassword);

  const hashPassword = '$2b$10$NiCWm3MxS0Me2P.atEB9/.HRxjsRHEu57gS8mTpGY0ZnlNKRbj/kO';

  const { item: user } = UserEntityGenerator.generate();
  const { item: createUserDto } = CreateUserDtoGenerator.generate();

  it('should throw EmailConflictException if email is already registered', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(user);
    await expect(sut.execute(createUserDto)).rejects.toThrow(EmailAlreadyExistsException);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      email: createUserDto.email,
    });
  });

  it('should register user if everything is correct', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(null);
    mockUserRepository.save.mockResolvedValueOnce(user);
    mockHashPassword.execute.mockResolvedValueOnce(hashPassword);
    await expect(sut.execute(createUserDto)).resolves.toStrictEqual(user);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      email: createUserDto.email,
    });
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      email: createUserDto.email,
      name: createUserDto.name,
      password: hashPassword,
    });
  });
});
