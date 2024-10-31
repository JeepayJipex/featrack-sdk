async function createCustomer(uniqueId: string, params: {
  customerName?: string
}) {
  return window.FT.customers.create(uniqueId, params)
}

export function setupCustomerForm(form: HTMLFormElement) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const uniqueId = form.querySelector<HTMLInputElement>('#uniqueId')!.value
    const name = form.querySelector<HTMLInputElement>('#name')!.value
    createCustomer(uniqueId, { customerName: name })
  })
}
