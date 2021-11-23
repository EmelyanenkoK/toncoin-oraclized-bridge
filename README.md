
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
func -SPA -o bridge_code2.fif stdlib.fc text_utils.fc message_utils.fc bridge-config.fc bridge_code.fc 
func -SPA -o votes-collector.fif stdlib.fc message_utils.fc bridge-config.fc votes-collector.fc 
func -SPA -o multisig-code.fif stdlib.fc multisig-code.fc 
```
