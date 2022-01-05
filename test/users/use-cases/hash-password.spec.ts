import { genSalt, hashSync } from 'bcrypt';

import { HashPassword } from '../../../src/users/use-cases/hash-password';

jest.mock('bcrypt');

const mockGenSaltBcrypt = jest.fn();
(genSalt as jest.Mock).mockImplementation(mockGenSaltBcrypt);

const mockHashBcrypt = jest.fn();
(hashSync as jest.Mock).mockImplementation(mockHashBcrypt);

describe('HashPassword', () => {
  const sut = new HashPassword();

  const hashPassword = '$2b$10$NiCWm3MxS0Me2P.atEB9/.HRxjsRHEu57gS8mTpGY0ZnlNKRbj/kO';
  const salt = '$2b$10$NiCWm3MxS0Me2P.atEB9/.';

  const params = { password: 'teste' };

  it('should hash the password', async () => {
    mockGenSaltBcrypt.mockReturnValueOnce(salt);
    mockHashBcrypt.mockReturnValueOnce(hashPassword);
    await expect(sut.execute(params)).resolves.toBe(hashPassword);
  });
});
