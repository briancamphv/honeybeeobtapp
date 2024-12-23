import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const StudyCards = () => {
  const [cards, setCards] = useState([
    { id: 1, question: 'What is the capital of France?', answer: 'Paris' },
    { id: 2, question: 'What is the largest ocean in the world?', answer: 'Pacific Ocean' },
    // Add more cards as needed
  ]);

  const handleSwipe = (cardIndex:number) => {
    // Do something with the swiped card
    console.log(`Swiped card ${cardIndex}`);
  };

  const renderCard = (card:any) => {
    return (
      <View style={styles.card}>
        <Text>{card.question}</Text>
        <Text>{card.answer}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={cards}
        renderCard={renderCard}
        onSwiped={handleSwipe}
        stackSize={3}
        cardIndex={0}
        backgroundColor={'#4FD0E9'}
        verticalSwipe={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default StudyCards;