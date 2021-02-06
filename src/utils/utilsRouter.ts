import { Request, Response, Router } from 'express';
import { getManager } from 'typeorm';

import { User } from '../entity/User';

const utilsRouter: Router = Router();

utilsRouter.post('/first-account', async (req: Request, res: Response) => {
  let user = new User();
  user.firstName = 'Test';
  user.lastName = 'Account';
  user.email = 'test@vtest.com';
  user.password = '123456';

  const userRepository = getManager().getRepository(User);
  user = userRepository.create(user);

  await userRepository.save(user);

  res.status(200).json({
    success: true,
    user: user
  });

});

export default utilsRouter;
