'use client';
import React from 'react';
import { setCookie } from 'cookies-next';

type Props = { token: string };

function SetToken({ token }: Props) {
  if (token) {
    // make time 1 hour
    setCookie('api-token', token, { maxAge: 3600 });
  }
  return null;
}

export default SetToken;
