import React, { useEffect } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';

type GlobalOperationsProps = {
  children?: React.ReactNode
}

export const GlobalOperations = (props: GlobalOperationsProps) => {
  const [accessToken] = useLocalStorage('accessToken');
  useEffect(() => {
    console.log(accessToken);
  }, [accessToken]);

  return (
    <>
      {props.children}
    </>
  );
}