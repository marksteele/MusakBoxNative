/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useRef} from 'react';
import {Animated, StyleSheet, Text, View, I18nManager} from 'react-native';
import {GlobalContext} from '../state/GlobalState';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const AppleStyleSwipeableRow = (props) => {
  const [{}, dispatch] = useContext(GlobalContext);
  const container = useRef(null);

  const renderRightAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      container.current.close();
      // dispatch remove
      dispatch({type: 'removeFromQueue', key: props.item.key});
    };
    return (
      <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
        <RectButton
          style={[styles.rightAction, {backgroundColor: color}]}
          onPress={pressHandler}>
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  const renderRightActions = (progress) => (
    <View
      style={{
        width: 192,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}>
      {renderRightAction('DeQ', '#dd2c00', 64, progress)}
    </View>
  );
  

  return (
    <Swipeable
      ref={container}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      renderRightActions={renderRightActions}>
      {props.children}
    </Swipeable>
  );
};

export default AppleStyleSwipeableRow;

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
