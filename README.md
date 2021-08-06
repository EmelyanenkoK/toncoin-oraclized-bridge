
## Prepare

```
PATH="/Users/tolyayanot/dev/newton/liteclient-build/crypto:$PATH"
export FIFTPATH=/Users/tolyayanot/dev/newton/ton/crypto/fift/lib:/Users/tolyayanot/dev/newton/ton/crypto/
```

## Run tests

```
node test/index.js
```

## Compile Func

```
func -SPA stdlib.fc nonstdlib.fc text_utils.fc message_utils.fc fee_utils.fc storage.fc bridge_code.fc get_methods.fc -o bridge.fif
```