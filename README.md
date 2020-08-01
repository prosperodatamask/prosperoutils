# Prospero Utilities

![Checks](https://github.com/prosperodatamask/prosperoutils/workflows/Checks/badge.svg)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ec2a64e88fdb9044ef2a/test_coverage)](https://codeclimate.com/github/prosperodatamask/prosperoutils/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/ec2a64e88fdb9044ef2a/maintainability)](https://codeclimate.com/github/prosperodatamask/prosperoutils/maintainability)

This package is a set of utility methods to help with [Prosper UI](https://github.com/prosperodatamask/prosperoui) and [Prospero CLI](https://github.com/prosperodatamask/prosperocli) to mask data from files.

## Usage

The basic usage of this module is to call `listModules` to get a module name to description map this is most useful for providing the available options to a front end for a user.  Then you can use the `modules` field to get to your transformer.

### Examples

Use a module through the base class

```javascript
const prospero = require('propsero');

const replace_opts = {
  replacement: 'XXXXXXXXXXX'
};
const instance = new prospero.modules['replace'].Transformer(replace_opts);
instance.transform('My data goes here'); // returns 'XXXXXXXXXXX'
```

Require module directly

```javascript
const replace = require('prospero/replace');

const replace_opts = {
  replacement: 'XXXXXXXXXXX'
};
const instance = new replace.Transformer(replace_opts);
instance.transform('My data goes here'); // returns 'XXXXXXXXXXX'
```

Require module via destructuring

```javascript
const {
  replace
} = require('prospero');
```

## Modules

### Copy

The `copy` module takes the data passed into the `transform` function and returns the data passed in.

#### Copy Options

None

#### Copy Examples

```javascript
const instance = new require('prospero/copy').Transformer();

expect(instance.transform('Input Text')).toEqual('Input Text');
```

### Replace

The `replace` module takes the data passed into the `transform` function and replaces it with data from options.

#### Replace Options

| Name | Type | Description | Default |
|:----:|------|-------------|:-------:|
| replacement | string | The replacement text | REDACTED |
| matchlength | boolean | If the replacement should match the length of the input data | false |

#### Replace Examples

```javascript
const instance_nomatch = new require('prospero/replace').Transformer();

const opts = {
  matchlength: true
};
const instance_match = new require('prospero/replace').Transformer(opts);

expect(instance_nomatch.transform('Input Text')).toEqual('REDACTED');
expect(instance_match.transform('Input Text')).toEqual('REDACTEDRE');
```

### Salesforce Id

The `salesforceid` module takes Salesforce Ids and masks them in ways that would be useful by preserving key parts of the data but masking the information that makes the Id retrievable.

#### Salesforce Id Options

| Name | Type | Description | Default |
|:----:|------|-------------|:-------:|
| preserveobjectkey | boolean | Preserves the first three characters of the Id to help identify what object the Id is for | true |
| mask | string | The text to mask the Id with | X |
| masklength | number | The number of characters at the end of the Id to mask | 6 |
| normalizelength | boolean | If the Id should be normalized to 18 characters | true |

#### Salesforce Id Examples

```javascript
const instance_default = new require('prospero/salesforce/id').Transformer();
const opts = {
  mask: 'ACCOUNT',
  masklength: 3,
  normalizelength: false
};
const instance_opts = new require('prospero').salesforceid.Transformer(opts);

expect(instance_default.transform('0018A00000Q9FuoQAF')).toEqual('0018A00000Q9XXXXXX');
expect(instance_opts.transform('0018A00000Q9Fuo')).toEqual('0018A00000Q9ACC');
```

## Adding new modules

Create a new module file under the root that extends the `Transformer` class provided by the `utils` module.  Then pass in your module's name and it's configuration and options (if valid) to the super constructor.  The implement your `transform` method.  Each module must export the following properties

* _name_ - The name of the module
* _description_ - A brief description of what the module does
* _Transformer_ - The transformer class

### Example

```javascript
const Transformer = require('./utils').Transformer;
const TransformerOption = require('./utils').TransformerOption;

const NAME = 'ysac';
const DISPLAY_NAME = 'You Suck at Cooking';
const DESCRIPTION = 'Replaces the data with a given number of peppers';

const options = [
  {
    name: 'count',
    display_name: 'Pepper Count',
    description: 'The number of peppers to return',
    type: 'number',
    default: 3
  }
];

const config = [];

options.forEach(option => {
  config.push(new TransformerOption(
    option.name,
    option.display_name,
    option.description,
    option.type,
    option.default
  ));
});

/**
 * The You Suck at Cooking transformer
 */
class YSAC extends Transformer {
  /**
   * The constructor
   * @param {Object} opts The options
   */
  constructor(opts) {
    super('ysac', config, opts);
  }

  /**
   * Transforms the data by outputting pepper a bunch of times
   *
   * NOTE: No parameter since we don't care what the source data is
   * @returns {String} The transformed data
   */
  transform() {
    const peppers = [];

    for (let i = 0; i < this.config.count.value; i += 1) {
      peppers.push('Pepper');
    }

    return peppers.join(' ');
  }
}

module.exports = {
  name: NAME,
  display_name: DISPLAY_NAME,
  description: DESCRIPTION,
  Transfomer: YSAC
};
```
