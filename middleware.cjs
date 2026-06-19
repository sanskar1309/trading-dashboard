// Custom json-server middleware
// Translates Django-style params into json-server params.
// Total count is read from X-Total-Count header on the frontend.

module.exports = (req, res, next) => {
  const q = req.query

  // Expose X-Total-Count to the browser (required for cross-origin reads)
  res.header('Access-Control-Expose-Headers', 'X-Total-Count')

  // ordering=field → _sort=field&_order=asc
  // ordering=-field → _sort=field&_order=desc
  if (q.ordering) {
    q._sort = q.ordering.startsWith('-') ? q.ordering.slice(1) : q.ordering
    q._order = q.ordering.startsWith('-') ? 'desc' : 'asc'
    delete q.ordering
  }

  // field__contains=value → field_like=value
  for (const key of Object.keys(q)) {
    if (key.endsWith('__contains')) {
      const field = key.slice(0, -'__contains'.length)
      q[`${field}_like`] = q[key]
      delete q[key]
    }
  }

  // limit/offset → _limit/_start
  if (q.limit !== undefined) {
    q._limit = q.limit
    delete q.limit
  }
  if (q.offset !== undefined) {
    q._start = q.offset
    delete q.offset
  }

  next()
}
