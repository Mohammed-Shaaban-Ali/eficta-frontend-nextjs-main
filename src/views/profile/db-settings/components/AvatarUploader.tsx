'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const AvatarUploader = () => {
  const t = useTranslations('Profile.settings.avatar');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (!file) {
      setError(t('errors.select_image'));
      setSuccess(false);
      return;
    }

    if (file.size > 800 * 1024) {
      setError(t('errors.size_limit'));
      setSuccess(false);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError(t('errors.only_images'));
      setSuccess(false);
      return;
    }

    reader.onload = () => {
      setImage(reader.result as any);
      setSuccess(true);
      setError('');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="row y-gap-30 items-center">
      <div className="col-auto">
        {image ? (
          <div className="d-flex ratio ratio-1:1 w-200">
            <Image
              width={200}
              height={200}
              src={image}
              alt="avatar"
              className="img-ratio rounded-4"
            />
            <div className="d-flex justify-end px-10 py-10 h-100 w-1/1 absolute">
              <div
                className="size-40 bg-white rounded-4 flex-center cursor-pointer"
                onClick={() => setImage('')}
              >
                <i className="icon-trash text-16" />
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex ratio ratio-1:1 w-200">
            <Image
              width={200}
              height={200}
              src="/img/misc/avatar-1.png"
              alt="avatar"
              className="img-ratio rounded-4"
            />
            <div className="d-flex justify-end px-10 py-10 h-100 w-1/1 absolute">
              <div className="size-40 bg-white rounded-4 flex-center cursor-pointer">
                <i className="icon-trash text-16" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="col-auto">
        <h4 className="text-16 fw-500">{t('title')}</h4>
        <div className="text-14 mt-5">{t('description')}</div>
        <div className="d-inline-block mt-15">
          <label
            htmlFor="avatar-upload"
            role="button"
            className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
          >
            <i className="icon-upload-file text-20 mr-10" />
            {t('browse')}
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
        {error && !success && <div className="text-red-1 mt-1">{error}</div>}
      </div>
    </div>
  );
};

export default AvatarUploader;
