import '@/styles/booking.css';
import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { UseFormReturn } from 'react-hook-form';
import { FlightBookingRequest } from '@/types/requests/flightBookingRequest';
import { useTranslations, useLocale } from 'next-intl';
import { FaSpinner, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { enUS as en } from 'date-fns/locale';
import { ar } from 'date-fns/locale/ar';
import 'react-datepicker/dist/react-datepicker.css';
import countryDialogs from '../../../../public/data/country_dailogs.json';

// Register locales
registerLocale('ar', ar);
registerLocale('en', en);

const CustomerInfo = ({
  form,
  onSubmit,
  isPending,
  members = [],
}: {
  form: UseFormReturn<FlightBookingRequest>;
  onSubmit: any;
  isPending: boolean;
  members?: any[];
}) => {
  const t = useTranslations('BookingPage.customer_info');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const [openForms, setOpenForms] = useState<number[]>([0]);

  return (
    <>
      <div className="col-xl-7 col-lg-8  select-none" style={{ width: '100%' }}>
        <div className="py-15 px-5 rounded-4 text-15 bg-blue-1-05  border-l-4 border-blue-1">
          {t('sign_in_notice')}
        </div>
        {/* End register notify */}

        <h2 className="text-22 fw-500 mt-40 md:mt-24">{t('let_us_know')}</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="row x-gap-5 y-gap-5 pt-5"
        >
          <div className="col-12 mt-5">
            <h3 className="text-18 fw-500 mb-5">{t('contact_information')}</h3>
            <div className="row x-gap-20 y-gap-20 py-5 bg-white  mb-5 rounded-4">
              <div className="col-md-12">
                <div className="form-input">
                  <input
                    type="email"
                    {...register(`contact_info.email` as any, {
                      required: true,
                      pattern: /^\S+@\S+$/i,
                    })}
                  />
                  <label className="lh-1 text-16 text-light-1">
                    {t('email')}
                  </label>
                </div>
                {errors?.contact_info?.email && (
                  <span className="text-red-1">{t('email_required')}</span>
                )}
              </div>
              <div className="col-md-6">
                <div className="form-input">
                  <input
                    type="text"
                    {...register(`contact_info.firstname` as any, {
                      required: true,
                    })}
                  />
                  <label className="lh-1 text-16 text-light-1">
                    {t('first_name')}
                  </label>
                </div>
                {errors?.contact_info?.firstname && (
                  <span className="text-red-1">{t('first_name_required')}</span>
                )}
              </div>
              <div className="col-md-6">
                <div className="form-input">
                  <input
                    type="text"
                    {...register(`contact_info.lastname` as any, {
                      required: true,
                    })}
                  />
                  <label className="lh-1 text-16 text-light-1">
                    {t('last_name')}
                  </label>
                </div>
                {errors?.contact_info?.lastname && (
                  <span className="text-red-1">{t('last_name_required')}</span>
                )}
              </div>
              <div className="col-md-4">
                <div className="form-input">
                  <select
                    {...register(`contact_info.country_code` as any, {
                      required: true,
                    })}
                    style={{
                      minHeight: '70px',
                      paddingTop: '25px',
                    }}
                    className="form-select"
                  >
                    <option value="">{t('select_country')}</option>
                    {countryDialogs.map((country) => (
                      <option key={country.code} value={country.dial_code}>
                        {country.name} ({country.dial_code})
                      </option>
                    ))}
                  </select>
                  <label
                    className="lh-1 text-16 text-light-1"
                    style={{ top: '20px' }}
                  >
                    {t('country_code')}
                  </label>
                </div>
                {errors?.contact_info?.country_code && (
                  <span className="text-red-1">
                    {t('country_code_required')}
                  </span>
                )}
              </div>

              <div className="col-md-8">
                <div className="form-input">
                  <input
                    type="tel"
                    {...register(`contact_info.phone` as any, {
                      required: true,
                    })}
                  />
                  <label className="lh-1 text-16 text-light-1">
                    {t('phone_number')}
                  </label>
                </div>
                {errors?.contact_info?.phone && (
                  <span className="text-red-1">
                    {t('phone_number_required')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {members.map((member, index) => (
            <React.Fragment key={index}>
              <div
                className="col-12 mt-10 d-flex justify-between items-center cursor-pointer border-light rounded-4 px-5 py-5 transition-all duration-300 hover:bg-blue-1/5"
                onClick={() => {
                  setOpenForms((prev) =>
                    prev.includes(index)
                      ? prev.filter((i) => i !== index)
                      : [...prev, index],
                  );
                }}
              >
                <h3 className="text-18 fw-500">
                  {`${t('passenger')} ${index + 1}`}
                  {index === 0 ? ` (${t('lead_passenger')})` : ''}
                  <span className="text-14 text-light-1 mx-10 px-10">
                    ({t(member.type.toLowerCase())})
                  </span>
                </h3>
                {openForms.includes(index) ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </div>
              {openForms.includes(index) && (
                <div className="col-12 animate-slideDown">
                  <div className="row x-gap-5 y-gap-5 p-5 bg-white shadow-sm rounded-4 mt-10">
                    <div className="col-md-12">
                      <div className="form-input">
                        <select
                          {...register(`paxList[${index}].gender` as any, {
                            required: true,
                          })}
                          style={{
                            minHeight: '70px',
                            paddingTop: '25px',
                          }}
                          className="form-select"
                        >
                          <option value="MALE">{t('male')}</option>
                          <option value="FEMALE">{t('female')}</option>
                        </select>
                        <label
                          className="lh-1 text-16 text-light-1"
                          style={{ top: '20px' }}
                        >
                          {t('title')}
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        <input
                          type="text"
                          {...register(`paxList[${index}].name` as any, {
                            required: true,
                          })}
                        />
                        <label className="lh-1 text-16 text-light-1">
                          {t('first_name')}
                        </label>
                      </div>
                      {errors?.paxList && errors?.paxList?.[index]?.name && (
                        <span className="text-red-1">
                          {t('first_name_required')}
                        </span>
                      )}
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        <input
                          type="text"
                          {...register(`paxList[${index}].lastName` as any, {
                            required: true,
                          })}
                        />
                        <label className="lh-1 text-16 text-light-1">
                          {t('last_name')}
                        </label>
                      </div>
                      {errors?.paxList &&
                        errors?.paxList?.[index]?.lastName && (
                          <span className="text-red-1">
                            {t('last_name_required')}
                          </span>
                        )}
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        <input
                          type="hidden"
                          {...register(`paxList[${index}].birthDate` as any, {
                            required: true,
                          })}
                        />
                        <DatePicker
                          selected={
                            watch(`paxList[${index}].birthDate` as any)
                              ? new Date(
                                  watch(`paxList[${index}].birthDate` as any),
                                )
                              : null
                          }
                          onChange={(date: Date | null) => {
                            if (date) {
                              const formattedDate = date
                                .toISOString()
                                .split('T')[0];
                              setValue(
                                `paxList[${index}].birthDate` as any,
                                formattedDate,
                                {
                                  shouldValidate: true,
                                },
                              );
                            } else {
                              setValue(
                                `paxList[${index}].birthDate` as any,
                                '',
                                {
                                  shouldValidate: true,
                                },
                              );
                            }
                          }}
                          dateFormat="yyyy-MM-dd"
                          maxDate={new Date()}
                          className="custom_input-picker w-100"
                          wrapperClassName="border"
                          autoComplete="off"
                          showPopperArrow={false}
                          popperPlacement={
                            isRTL ? 'bottom-end' : 'bottom-start'
                          }
                          isClearable={true}
                          locale={isRTL ? 'ar' : 'en'}
                          calendarClassName={isRTL ? 'rtl-calendar' : ''}
                        />
                        <label className="lh-1 text-16 text-light-1">
                          {t('birth_date')}
                        </label>
                      </div>
                      {errors?.paxList &&
                        errors?.paxList?.[index]?.birthDate && (
                          <span className="text-red-1">
                            {t('birth_date_required')}
                          </span>
                        )}
                    </div>

                    <div className="col-md-6">
                      <div className="form-input">
                        <select
                          {...register(`paxList[${index}].type` as any, {
                            required: true,
                          })}
                          style={{
                            minHeight: '70px',
                            paddingTop: '25px',
                          }}
                          className="form-select"
                          defaultValue={member.type}
                        >
                          <option value="ADULT">{t('adult')}</option>
                          <option value="CHILD">{t('child')}</option>
                          <option value="INFANT">{t('infant')}</option>
                        </select>
                        <label
                          className="lh-1 text-16 text-light-1"
                          style={{ top: '20px' }}
                        >
                          {t('passenger_type')}
                        </label>
                      </div>
                    </div>

                    {/* Only show passport information for the lead passenger (index 0) */}
                    {index === 0 && (
                      <>
                        <div className="col-md-12">
                          <h4 className="text-16 fw-500 mt-10 mb-10">
                            {t('passport_information')}
                          </h4>
                        </div>

                        <div className="col-md-6">
                          <div className="form-input">
                            <input
                              type="text"
                              {...register(
                                `paxList[${index}].identityInfo.passport.no` as any,
                                {
                                  required: true,
                                },
                              )}
                            />
                            <label className="lh-1 text-16 text-light-1">
                              {t('passport_number')}
                            </label>
                          </div>
                          {errors?.paxList &&
                            errors?.paxList?.[index]?.identityInfo?.passport
                              ?.no && (
                              <span className="text-red-1">
                                {t('passport_number_required')}
                              </span>
                            )}
                        </div>

                        <div className="col-md-6">
                          <div className="form-input">
                            <input
                              type="hidden"
                              {...register(
                                `paxList[${index}].identityInfo.passport.endDate` as any,
                                {
                                  required: true,
                                },
                              )}
                            />
                            <DatePicker
                              selected={
                                watch(
                                  `paxList[${index}].identityInfo.passport.endDate` as any,
                                )
                                  ? new Date(
                                      watch(
                                        `paxList[${index}].identityInfo.passport.endDate` as any,
                                      ),
                                    )
                                  : null
                              }
                              onChange={(date: Date | null) => {
                                if (date) {
                                  const formattedDate = date
                                    .toISOString()
                                    .split('T')[0];
                                  setValue(
                                    `paxList[${index}].identityInfo.passport.endDate` as any,
                                    formattedDate,
                                    {
                                      shouldValidate: true,
                                    },
                                  );
                                } else {
                                  setValue(
                                    `paxList[${index}].identityInfo.passport.endDate` as any,
                                    '',
                                    {
                                      shouldValidate: true,
                                    },
                                  );
                                }
                              }}
                              dateFormat="yyyy-MM-dd"
                              minDate={new Date()}
                              className="custom_input-picker w-100"
                              wrapperClassName="border"
                              autoComplete="off"
                              showPopperArrow={false}
                              popperPlacement={
                                isRTL ? 'bottom-end' : 'bottom-start'
                              }
                              isClearable={true}
                              locale={isRTL ? 'ar' : 'en'}
                              calendarClassName={isRTL ? 'rtl-calendar' : ''}
                            />
                            <label className="lh-1 text-16 text-light-1">
                              {t('passport_expiry')}
                            </label>
                          </div>
                          {errors?.paxList &&
                            errors?.paxList?.[index]?.identityInfo?.passport
                              ?.endDate && (
                              <span className="text-red-1">
                                {t('passport_expiry_required')}
                              </span>
                            )}
                        </div>

                        <div className="col-md-6">
                          <div className="form-input">
                            <input
                              type="text"
                              {...register(
                                `paxList[${index}].identityInfo.passport.citizenshipCountry` as any,
                                {
                                  required: true,
                                },
                              )}
                            />
                            <label className="lh-1 text-16 text-light-1">
                              {t('citizenship_country')}
                            </label>
                          </div>
                          {errors?.paxList &&
                            errors?.paxList?.[index]?.identityInfo?.passport
                              ?.citizenshipCountry && (
                              <span className="text-red-1">
                                {t('citizenship_country_required')}
                              </span>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          <div className="col-12 mt-5">
            <div className="row y-gap-5 items-center justify-between">
              <div className="col-auto">
                <div className="text-14 text-light-1">
                  {t('terms_agreement')}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <button
              type="submit"
              disabled={isPending}
              className="button h-50 px-24 -dark-1 bg-blue-1 text-white d-flex align-items-center gap-10 transition-all duration-300 hover:bg-blue-2"
            >
              {isPending ? (
                <>
                  <FaSpinner
                    className="spinner-border spinner-border-sm me-2"
                    style={{ animation: 'spin 1s linear infinite' }}
                  />
                  {t('booking')}
                </>
              ) : (
                t('book_now')
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomerInfo;
