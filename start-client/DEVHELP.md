# Developer Help

## Project Metadata Fields

* `src/components/reducer/Initializr.js`
  * define field:
    ```
    export const defaultInitializrContext = {
      values: {
        ...
        foo: '',
        ...
    ```
  * auto update
    ```
    export function reducer(state, action) {
      switch (action.type) {
      ...
        case 'UPDATE': {
          ...
          if (get(changes, 'foo')) {
            const {foo, ...err} = errors
            errors = err
          }
          ...
    ```
* `src/components/utils/ApiUtils.js`
  * add mapping:
    ```
    const PROPERTIES_MAPPING_URL = {
      ...
      foo: 'foo',   // payloadName: 'localName'
      ...
    ```
  * add to `getLists`:
    ```
    export const getLists = json => {
      ...
      return {
        ...
        foo: get(json, 'foo.values', []).map(foo => ({
          key: `${foo.id}`,
          text: `${foo.name}`,
        })),
        ...
        
    ```
  * add to `getDefaultValues`:
    ```
    export const getDefaultValues = json => {
      return {
        ...
        foo: get(json, 'foo.default'),
        ...
    ```
  * add to `getProject`:
    ```
    const params = querystring.stringify({
        ...
        foo: get(values, 'foo'),
        ...
    ```
* `src/components/common/builder/Warnings.js`
  * add to `Warnings`:
    ```
    const { warnings, dispatch } = useContext(InitializrContext)
      ...
      {get(warnings, 'steeltoe') && (
        <li>
          ...
          <strong className='warn'>{get(warnings, 'foo.value')}</strong>
          ...
        </li>
      )}
* `src/components/common/builder/Fields.js`
  * add HTML control
 

    