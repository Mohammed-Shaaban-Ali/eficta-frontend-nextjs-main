'use client';
import React from 'react';
import { setCookie } from 'cookies-next';

type Props = { token: string };

function SetToken({ token }: Props) {
  if (token) {
    setCookie('api-token', token);
  }
  return null;
}

export default SetToken;
