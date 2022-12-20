# TON-EVM Toncoin Bridge

TON-Ethereum Bridge in `master` branch.

TON-BSC (Binance Smart Chain) Bridge in `bsc` branch.

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
func -o bridge_code2.fif -SPA stdlib.fc text_utils.fc message_utils.fc bridge-config.fc bridge_code.fc
func -o votes-collector.fif -SPA stdlib.fc message_utils.fc bridge-config.fc votes-collector.fc
func -o multisig-code.fif -SPA stdlib.fc multisig-code.fc
```
