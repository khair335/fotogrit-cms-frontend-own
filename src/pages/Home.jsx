import { useSelector } from 'react-redux';

import { Card } from '@/components/Card';

import { selectCurrentUser } from '@/services/state/authSlice';

const Home = () => {
  const user = useSelector(selectCurrentUser);

  const welcome =
    user !== null
      ? `Welcome ${
          user?.fullname
            ? user?.fullname
            : user?.email.split('@')[0].replace('.', ' ')
        }`
      : 'Welcome!';

  return (
    <>
      <Card className="p-5">
        <h1 className="text-2xl font-bold capitalize">{welcome}</h1>
      </Card>
    </>
  );
};

export default Home;
