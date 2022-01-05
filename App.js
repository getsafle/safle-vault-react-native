// import CryptoJS from "react-native-crypto-js";
// const crypto = require('crypto');
require('node-libs-react-native/globals');

import RnBgTask from 'react-native-bg-thread';
import FastImage from 'react-native-fast-image'

const vaultSDK = require('@getsafle/vault-housekeeper').Vault;

const Vault = require('@getsafle/safle-vault');

const vaultEnc = 'U2FsdGVkX18xAU1T3xtUYoxvlcJ1azevB7wzt5cLCsv78+Xh8vOg1bq0iEzOkA+8J3F4gjSQ3X2fngQnFOAKmjz9qt+WZ1tH6Z/fV29MH/U4ZfTiHbYVbwFP+JPl9di0il1AwuasVTkiE6NDiTbJHoAGH4JwlASVGUqapVd4bfpneR+zc6ZAAYxzJX/ufnrGzNBycrmjPPNg33jCXLy9rS0lvCZgdfuJkIdlzoYuHTCbzrAgvJ2GNvLu094tLF3ItAu/wjISdTjtFKxoSETfYn1WAMOhC0TEuIGoeTHe9jRDH/Rxj/bpFMaVN0HHvCuwwxuQ8mxaP99TiNG4v8LB/0KR7zMM2wfCahYzE8PcbeS/gUmGew8hALBf3F2FBpQbFFus/DGxjxFIKRuu+QQuxw==';

import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Image
} from 'react-native';

let vault;

const App= () => {
  const [gen, setGen] = React.useState('');
  const [ accounts, setAccounts ] = React.useState( [] );
  const [ pKey, setPkey ] = React.useState( '' );
  const [loading, setLoading] = React.useState( false );

  const decKey = JSON.parse( '{"0":139,"1":163,"2":170,"3":82,"4":162,"5":27,"6":97,"7":26,"8":174,"9":68,"10":135,"11":41,"12":2,"13":220,"14":124,"15":141,"16":213,"17":198,"18":123,"19":178,"20":36,"21":254,"22":246,"23":32,"24":72,"25":165,"26":123,"27":121,"28":197,"29":86,"30":96,"31":166,"32":232,"33":157,"34":7,"35":36,"36":234,"37":152,"38":101,"39":222,"40":96,"41":30,"42":215,"43":165,"44":147,"45":82,"46":69,"47":99,"48":55,"49":16,"50":238,"51":82,"52":211,"53":141,"54":47,"55":212,"56":196,"57":61,"58":8,"59":85,"60":221,"61":139,"62":215,"63":244}' );

  
  let accts;

  React.useEffect( () => {
    const p = async () => {
      vault = new Vault('https://ropsten.infura.io/v3/8faaf4fcbdcc4dd0bee8c87eb4b0315b', vaultEnc );
      await vault.restoreKeyringState(vaultEnc, '123456', decKey);
      accts = (await vault.getAccounts( decKey )).response;
      setAccounts( accts.map( e => e.address ) );
      console.log( 'get accounts: ', accts );
    }
    p();
    
  }, [] );
  
  const generate = async () => {  

    RnBgTask.runInBackground_withPriority("MIN", async () =>{
      console.log('generate');
      setLoading( true );
        //simulate long running task (vault generation)
        await new Promise( (res) => setTimeout( () => res('ok'), 2000 ) );  
        const na = await vault.addAccount( decKey, '123456');
        accts = (await vault.getAccounts( decKey )).response;
        setAccounts( accts.map( e => e.address ) );
        const pk = (await vault.exportPrivateKey( accounts[ accounts.length-1 ], '123456')).response;
        setPkey( pk );
        const mnemonic = (await vault.exportMnemonic('123456') ).response;
        console.log( mnemonic );   
      
      console.log('finished.');
      setLoading( false );
    });
  }
  return (
    <SafeAreaView style={{ flex: 1, padding: 20, height: Dimensions.get('screen').height,justifyContent: 'space-between'}}>    
      <View style={styles.cont}>
        <TouchableOpacity onPress={generate} style={styles.button}>
          <Text style={styles.buttonLabel}>GENERATE WALLET</Text>
        </TouchableOpacity>

        {accounts.map( addr => (
        <View key={addr}>
          <Text style={{marginTop: 30, fontSize: 14}}>
          {addr}
        </Text></View>))}
      </View>
      {loading && <FastImage style={{ width: 40, height: 40, alignSelf: 'center' }} 
      source={require('./loading.gif')} />}

      <View style={{...styles.cont, alignSelf: 'flex-start', justifySelf: 'flex-end' }}>
        <Text>Pkey: {pKey}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cont: {
    paddingLeft: 20,
    paddingRight: 20
  },
  button: {
    backgroundColor: '#4466ff',
    padding: 6,
    width: 170,
    borderRadius: 14,
  },
  buttonLabel: {
    textAlign: 'center',
    color: '#ffffff'
  }
});

export default App;
