import React from 'react';
import { Button, View, StyleSheet, SafeAreaView } from 'react-native';

import { Amplify } from 'aws-amplify';
import { get } from 'aws-amplify/api';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

import outputs from '@/src/amplifyconfiguration.json';

Amplify.configure(outputs);

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.button}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const callLambda = async () => {
  try {
    const restOperation = get({
      apiName: 'amplibotapi',
      path: '/helloworld',
    });
    const response = await restOperation.response;
    const json = await response.body.json();
    console.log('Lambda response:', json);
  } catch (error) {
    console.error('Error calling Lambda function:', error);
  }
};

const LambdaButton = () => {
  return (
    <View style={styles.button}>
      <Button title="Call Lambda" onPress={callLambda} />
    </View>
  );
};

const App = () => {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <SafeAreaView>
          <SignOutButton />
          <LambdaButton />
        </SafeAreaView>
      </Authenticator>
    </Authenticator.Provider>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
  },
});

export default App;
