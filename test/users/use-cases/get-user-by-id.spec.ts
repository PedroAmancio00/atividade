import { mock } from 'jest-mock-extended';

import { GetUserById } from '../../../src/users/use-cases/get-user-by-id';
import { UserRepository } from '../../../src/users/users.repository';
import { UserEntityGenerator } from '../generator/user-entity.generator';

describe('GetUserById', () => {
  const mockUserRepository = mock<UserRepository>();
  const sut = new GetUserById(mockUserRepository);
  const { item: user } = UserEntityGenerator.generate();
  const params = user.id;

  it('should return null if user was not found', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(null);
    await expect(sut.execute(params)).resolves.toBe(null);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      id: params,
    });
  });

  it('should return the user if everything is correct', async () => {
    mockUserRepository.findOne.mockResolvedValueOnce(user);
    await expect(sut.execute(params)).resolves.toBe(user);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      id: params,
    });
  });
});
