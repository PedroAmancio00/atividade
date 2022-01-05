import { compareSync } from 'bcrypt';

import { ValidatePassword } from '../../../src/users/use-cases/validate-password';

jest.mock('bcrypt');

const mocCompareSyncBcrypt = jest.fn();
(compareSync as jest.Mock).mockImplementation(mocCompareSyncBcrypt);

describe('ValidatePassword', () => {
  const sut = new ValidatePassword();

  const params = { password: 'desafio1234', hash: '$2b$10$yoxXM.Pg6uS1F6omtK/BJewLSmJdpf40cUAMrdMky.ajbYZnv32VS' };

  it('should return false if password does not match', async () => {
    mocCompareSyncBcrypt.mockReturnValueOnce(false);
    await expect(sut.execute(params)).resolves.toBe(false);
  });

  it('should return true if password match', async () => {
    mocCompareSyncBcrypt.mockReturnValueOnce(true);
    await expect(sut.execute(params)).resolves.toBe(true);
  });
});
