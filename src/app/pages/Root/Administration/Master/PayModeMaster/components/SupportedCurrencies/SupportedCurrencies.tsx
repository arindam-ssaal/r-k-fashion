import { useFormContext } from "react-hook-form";

import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function SupportedCurrencies() {
  const { control } = useFormContext();

  const currencies = [
    { currencyID: 1, paymentModeID: 0, id: "INR", label: "Indian Rupees (INR)" },
    { currencyID: 2, paymentModeID: 0, id: "USD", label: "US Dollars (USD)" },
    { currencyID: 3, paymentModeID: 0, id: "EUR", label: "Euros (EUR)" },
    { currencyID: 4, paymentModeID: 0, id: "GBP", label: "British Pounds (GBP)" },
  ];

  return (
    <FormField
      control={control}
      name="objCurrency"
      render={({ field }) => (
        <RadioGroup
          onValueChange={(value) => {
            const selectedCurrency = currencies.find((c) => c.id === value);
            if (selectedCurrency) {
              field.onChange([
                {
                  currencyID: selectedCurrency.currencyID,
                  paymentModeID: selectedCurrency.paymentModeID,
                  currencyCode: selectedCurrency.id,
                  currencyName: selectedCurrency.label,
                },
              ]);
            }
          }}
          className="space-y-3 roles-radio"
        >
          {currencies.map((currency) => (
            <FormItem key={currency.id} className="flex items-center space-x-3">
              <FormControl>
                <RadioGroupItem
                  value={currency.id}
                  checked={
                    field.value &&
                    field.value.some(
                      (selected) => selected.currencyCode === currency.id
                    )
                  }
                />
              </FormControl>
              <FormLabel>{currency.label}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      )}
    />
  );
}

export default SupportedCurrencies;
