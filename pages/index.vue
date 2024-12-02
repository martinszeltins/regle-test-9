<template>
    <div>
        <div class="fixed top-5 right-5 bg-gray-200 border border-gray-400 w-[450px] h-[calc(100vh-50px)] overflow-x-hidden overflow-y-auto text-sm p-4 rounded">
            <pre>{{ r$ }}</pre>
        </div>

        <div class="fixed top-5 left-5 bg-gray-200 border border-gray-400 w-[330px] overflow-hidden text-sm p-4 rounded">
            <pre>
[ ] Backend validation, rule
    parsing (!) - (backend errors
    dont get added)
[x] Conditional rules
[x] Dynamic, custom error messages
    with i18n, (minWeight example)
    from LiPO.
[ ] No frontend rule, only backend
    rule (does it work?) (!)
[x] Easy, custom rules with custom
    message
[x] Get dirty fields
[x] Collections
[ ] Live, lazy validation (validate
    does not work at all)
[ ] Resetting validation
    (BE errors dont get added after
    reset + validate)
[ ] Clear backend validation
[ ] Trigger validation for
    individual fields.
[ ] touch() and touched, also check
    for collections.
[ ] reset validation for specific
    fields only.
[x] easily get which fields are
    required so we can show *
[ ] Test if we can access parent
    fields in validation rule.
[ ] Swap all rules with another
    set of rules.
[ ] Backend message appears on first
    validation() call. But if we
    call reset and then validate()
    again, the backend message
    does not show up.
[ ] Rule function pass arguments.
[ ] Clear BE errors on change.
[ ] $each: (_, index) any type!?
            </pre>
        </div>

        <h1 class="font-bold text-2xl">New Shipment</h1>

        <div class="bg-white shadow-lg rounded-lg p-5 mt-5">
            <h2 class="font-semibold">Shipment Data</h2>

            <!-- Shipment Reference Number -->
            <div class="mt-4 flex flex-col gap-2">
                <div class="flex gap-2">
                    <label class="font-medium uppercase text-xs text-gray-700">Shipment Reference Number</label>
                    <span class="text-red-600 relative -top-1" v-if="r$.$fields.referenceNumber.$isRequired">*</span>
                </div>

                <input v-model="form.referenceNumber" type="text" class="w-1/2 ring-1 ring-gray-300 rounded outline-none p-2" />

                <FieldError :errors="r$.$errors.referenceNumber" />
            </div>

            <!-- Shipment Items -->
            <h3 class="font-semibold my-4">Shipment Items</h3>

            <div v-for="(_, index) in form.shipmentItems" class="border border-dashed border-gray-300 p-4 rounded-lg mt-4">
                <h3 class="font-semibold uppercase text-xs text-gray-700 mb-3">
                    Item {{ index + 1 }}
                </h3>

                <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div class="flex flex-col gap-2">
                        <div class="flex gap-1">    
                            <label class="font-medium uppercase text-xs text-gray-700">Item Name</label>
                            <span class="text-red-600 relative -top-1" v-if="r$.$fields.shipmentItems.$each[index].$fields.name.$isRequired">*</span>
                        </div>

                        <input v-model="form.shipmentItems[index].name" type="text" class="ring-1 ring-gray-300 rounded outline-none p-2" />
                        <FieldError :errors="r$.$errors.shipmentItems.$each[index].name" />
                    </div>
    
                    <div class="flex flex-col gap-2">
                        <div class="flex gap-1">
                            <label class="font-medium uppercase text-xs text-gray-700">Quantity</label>
                            <span class="text-red-600 relative -top-1" v-if="r$.$fields.shipmentItems.$each[index].$fields.quantity.$isRequired">*</span>
                        </div>

                        <input v-model="form.shipmentItems[index].quantity" type="number" class="ring-1 ring-gray-300 rounded outline-none p-2" />
                        <FieldError :errors="r$.$errors.shipmentItems.$each[index].quantity" />
                    </div>
    
                    <div class="flex flex-col gap-2">
                        <div class="flex gap-1">
                            <label class="font-medium uppercase text-xs text-gray-700">Weight</label>
                            <span class="text-red-600 relative -top-1" v-if="r$.$fields.shipmentItems.$each[index].$fields.weight.$isRequired">*</span>
                        </div>
                        
                        <input v-model="form.shipmentItems[index].weight" type="number" class="ring-1 ring-gray-300 rounded outline-none p-2" />
                        <FieldError :errors="r$.$errors.shipmentItems.$each[index].weight" />
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <button @click="validateForm" class="bg-blue-500 text-white px-10 py-3 rounded mt-6 hover:bg-blue-600 transition">
                Save
            </button>

            <button @click="someCondition = !someCondition" class="ml-2 bg-gray-500 text-white px-10 py-3 rounded mt-6 hover:bg-gray-600 transition">
                Toggle Condition: {{ someCondition ? 'ON' : 'OFF' }}
            </button>

            <button @click="someNumber++" class="ml-2 bg-gray-500 text-white px-10 py-3 rounded mt-6 hover:bg-gray-600 transition">
                Some Number: {{ someNumber }}
            </button>

            <button @click="toggleLocale" class="ml-2 bg-gray-500 text-white px-10 py-3 rounded mt-6 hover:bg-gray-600 transition">
                Toggle Locale
            </button>

            <button @click="getDirtyFields" class="ml-2 bg-gray-500 text-white px-10 py-3 rounded mt-6 hover:bg-gray-600 transition">
                Get Dirty Fields
            </button>

            <button @click="addShipmentItem" class="ml-2 bg-gray-500 text-white px-10 py-3 rounded mt-6 hover:bg-gray-600 transition">
                Add Shipment Item
            </button>

            <button @click="resetValidation" class="ml-2 bg-gray-500 text-white px-10 py-3 rounded mt-6 hover:bg-gray-600 transition">
                Reset Validation
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { defineRegleConfig } from '@regle/core'
    import type { RegleExternalErrorTree } from '@regle/core'
    import { required, minLength, minValue, applyIf, withMessage, withParams } from '@regle/rules'

    const { t, locale, setLocale } = useI18n()

    const someCondition = ref(true)
    const someNumber = ref(4)

    interface Form {
        referenceNumber: string
        shipmentItems: {
            name: string
            quantity: number
            weight: number | string
        }[]
    }

    const form = ref<Form>({
        referenceNumber: '',
        shipmentItems: [
            { name: '', quantity: 0, weight: 0 },
            { name: '', quantity: 0, weight: 0 }
        ]
    })

    const externalErrors = ref<RegleExternalErrorTree<Form>>({
        referenceNumber: ['Backend says reference number is invalid'],
        shipmentItems: {
            $each: [
                {
                    name: ['Backend says shipmentItem[0].name is invalid'],
                },
            ],
        }
    })

    const { useRegle } = defineRegleConfig({
        shortcuts: {
            fields: {
                $isRequired: (field) => !!field.$rules.required?.$active
            }
        }
    })

    const minWeightRule = () => {
        return withMessage(
            value => Number(value) >= someNumber.value && someCondition.value === true,
            t('no_good', { name: someNumber.value })
        )
    }

    // Test index & argument
    const extraWeightRule = (myArg: string, index: number) => {
        return withMessage(
            withParams(value => {
                return myArg === 'weight banana'
                    && Number(value) > 1
                    && someCondition.value === false
            }, [someCondition]),
            t('totally_not_good', { name: myArg + index })
        )
    }
        

    const rules = computed(() => {
        return {
            shipmentItems: {
                $each: (_, index) => ({
                    name: {
                        required: applyIf(someCondition, required),
                        minLength: applyIf(someCondition, minLength(3))
                    },
                    quantity: {
                        minValue: minValue(1),
                        extraWeightRule: extraWeightRule('quantity banana', index)
                    },
                    weight: {
                        required,
                        minWeight: minWeightRule(),
                        extraWeightRule: extraWeightRule('weight banana', index)
                    }
                })
            }
        }
    })

    const { r$ } = useRegle(form, rules, { externalErrors, autoDirty: true  })

    const toggleLocale = () => {
        setLocale(locale.value === 'en' ? locale.value = 'es' : locale.value = 'en')
    }

    const addShipmentItem = () => {
        form.value.shipmentItems.push({ name: '', quantity: 1, weight: '' })
    }

    const getDirtyFields = () => {
        console.log(r$.$extractDirtyFields())
    }

    const validateForm = async () => {
        const result = await r$.$validate()

        console.log('Form is valid?', result)
    }

    const resetValidation = () => {
        r$.$reset()
    }
</script>
