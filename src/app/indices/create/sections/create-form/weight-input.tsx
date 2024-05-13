import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from '@/components/shadcn'
import { UseFormReturn } from 'react-hook-form'
import { CreateIndexFormValues } from '.'

type TWeightInputProps = {
  index: number
  form: UseFormReturn<CreateIndexFormValues, unknown, undefined>
}

const WeightInput = ({ index, form }: TWeightInputProps) => {
  // const weight = form.watch(`weights.${index}`)
  const weights = form.watch('weights')

  return (
    <FormField
      control={form.control}
      name={`weights.${index}`}
      render={({ field }) => (
        <FormItem className="col-span-7 flex flex-col justify-center items-center">
          <FormControl>
            <Input
              className="w-full text-center font-medium"
              placeholder="Weight Percentage"
              {...field}
              onBlur={(e) => {
                const sumOfWeights = weights.reduce((acc, weight) => {
                  if (
                    weight !== undefined ||
                    weight !== null ||
                    weight !== ''
                  ) {
                    if (weight && weight[weight.length - 1] === '%')
                      return acc + parseInt(weight.replace('%', ''))
                  }
                  return acc
                }, 0)
                if (sumOfWeights + parseInt(e.target.value) > 100) {
                  form.setValue(`weights.${index}`, `${100 - sumOfWeights}%`)
                  form.trigger(`weights.${index}`)
                } else if (
                  e.target.value &&
                  e.target.value[e.target.value.length - 1] !== '%'
                ) {
                  form.setValue(
                    `weights.${index}`,
                    `${parseInt(e.target.value)}%`
                  )
                  form.trigger(`weights.${index}`)
                }

                // if (sumOfWeights + parseInt(weight) > 100) {
                //   form.setValue(`weights.${index}`, `${100 - sumOfWeights}%`)
                //   form.trigger(`weights.${index}`)
                // } else if (weight && weight[weight.length - 1] !== '%') {
                //   form.setValue(`weights.${index}`, `${parseInt(weight)}%`)
                //   form.trigger(`weights.${index}`)
                // }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { WeightInput }
