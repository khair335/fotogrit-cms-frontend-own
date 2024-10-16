import React from 'react';

import { Button } from '@/components';

import { Paragraph } from '../typography';
import { CurrencyFormat } from '@/helpers/CurrencyFormat';

const FormDetailAllService = (props) => {
  const { data, setOpenModal } = props;

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Service ID</h5>
          <Paragraph>{data?.code || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Service Name</h5>
          <Paragraph>{data?.name || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Service Type</h5>
          <Paragraph>{data?.service_type || '-'}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Service Fee</h5>
          <div className="flex flex-col py-1">
            {data?.basic_fixed_fee !== 0 && (
              <p>
                Fixed Fee:{' '}
                <span className="text-black">
                  {CurrencyFormat(data?.basic_fixed_fee)}
                </span>
              </p>
            )}
            {data?.percent_to_shared !== 0 && (
              <p>
                % Paid to Other User:{' '}
                <span className="text-black">{data?.percent_to_shared}%</span>
              </p>
            )}
            {data?.photo_price !== 0 && (
              <p>
                Photo Price:{' '}
                <span className="text-black">
                  {CurrencyFormat(data?.photo_price)}
                </span>
              </p>
            )}
            {data?.video_price !== 0 && (
              <p>
                Video Price:{' '}
                <span className="text-black">
                  {CurrencyFormat(data?.video_price)}
                </span>
              </p>
            )}
            {data?.score_price !== 0 && (
              <p>
                Score Price:{' '}
                <span className="text-black">
                  {CurrencyFormat(data?.score_price)}
                </span>
              </p>
            )}
            {data?.stream_price !== 0 && (
              <p>
                Stream Price:{' '}
                <span className="text-black">
                  {CurrencyFormat(data?.stream_price)}
                </span>
              </p>
            )}

            {data?.variable_fees?.length === 0 ||
              (data?.variable_fees[0]?.amount !== 0 && (
                <>
                  <span className="text-black">Variable Fees</span>
                  {data?.variable_fees?.map((item, i) => {
                    let unit;
                    const price = item?.fee_unit;

                    unit = `${item?.min_unit}-${item?.max_unit}`;

                    return (
                      <p key={`fixed-fee-${i}`} className="font-medium">
                        {`${unit} units : `}
                        <span className="text-black">
                          {CurrencyFormat(price)}
                        </span>
                      </p>
                    );
                  })}
                </>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Rating</h5>
          <Paragraph>{data?.rating || '-'}</Paragraph>
        </div>
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="gray"
          className="w-32"
          onClick={() => setOpenModal(false)}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default FormDetailAllService;
