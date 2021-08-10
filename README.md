
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
func -SPA stdlib.fc text_utils.fc message_utils.fc bridge-config.fc bridge_code.fc -o bridge_code2.fif
func -SPA stdlib.fc message_utils.fc bridge-config.fc votes-collector.fc -o votes-collector.fif
func -SPA stdlib.fc multisig-code.fc -o multisig-code.fif
```
