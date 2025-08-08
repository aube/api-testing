
export const toEqualSentData = (expect, body, awaitingData) => {
  const excludeFields = [
    'created_at',
    'updated_at',
  ]

  Object.entries(awaitingData).forEach(([k, v]) => {
    if (excludeFields.includes(k)) {
      return
    }
    expect(body).toHaveProperty(k);
    expect(body[k]).toBe(v);
  })
}