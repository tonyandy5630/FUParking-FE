import FormInput from "@/components/Form/Input";
import { PriceItem } from "@/types/price-item.type";
import { PriceItemRequestSchemaType } from "@/utils/schemas/priceItemSchema";
import React from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  index: number;
  fieldArrayName: string;
  value?: PriceItem;
  error?: FieldErrors<PriceItemRequestSchemaType>;
};

export default function PriceItemInput({
  index,
  fieldArrayName,
  value,
  error,
}: Props) {
  return (
    <div className='flex flex-col items-start'>
      <div className='flex justify-between items-center gap-x-3 min-w-fit '>
        <div className='flex items-center'>
          <InputContainer>
            <FormInput
              type='number'
              name={`${fieldArrayName}.${index}.from`}
              autoFocus={true}
              label='From Hour'
              defaultValue={value?.applyFromHour}
              placeholder='Enter From Hour'
              error={
                error?.priceItems ? error.priceItems[0]?.from?.message : ""
              }
            />
          </InputContainer>
          <span>-</span>
          <InputContainer>
            <FormInput
              type='number'
              name={`${fieldArrayName}.${index}.to` as const}
              label='To Hour'
              defaultValue={value?.applyToHour}
              placeholder='Enter To Hour'
              error={error?.priceItems ? error.priceItems[0]?.to?.message : ""}
            />
          </InputContainer>
        </div>
        <div className='flex items-center'>
          <InputContainer>
            <FormInput
              type={"number"}
              name={`${fieldArrayName}.${index}.minPrice` as const}
              label='Min Price'
              defaultValue={value?.minPrice}
              placeholder='Enter From Hour'
              endAdornment='VND'
              error={
                error?.priceItems ? error.priceItems[0]?.minPrice?.message : ""
              }
            />
          </InputContainer>
          <span>-</span>
          <InputContainer>
            <FormInput
              type='number'
              name={`${fieldArrayName}.${index}.maxPrice` as const}
              autoFocus={true}
              label='Max Price'
              defaultValue={value?.maxPrice}
              placeholder='Enter Max Price'
              endAdornment='VND'
              error={
                error?.priceItems ? error.priceItems[0]?.maxPrice?.message : ""
              }
            />
          </InputContainer>
        </div>
        <InputContainer>
          <FormInput
            type='number'
            name={`${fieldArrayName}.${index}.blockPricing` as const}
            label='Block Price'
            defaultValue={value?.blockPricing}
            placeholder='Enter Block Price'
            endAdornment='VND'
            error={
              error?.priceItems
                ? error.priceItems[0]?.blockPricing?.message
                : ""
            }
          />
        </InputContainer>
      </div>
    </div>
  );
}

const InputContainer = ({ children }: { children: any }) => (
  <div>{children}</div>
);
