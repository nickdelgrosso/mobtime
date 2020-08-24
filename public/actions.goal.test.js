import test from 'ava';

import * as actions from './actions';
import * as effects from './effects';

const makeGoal = (text) => ({
  id: Math.random().toString(36).slice(2),
  text,
  completed: false,
});

test('can add goal', (t) => {
  const websocket = {};
  const goalTextToAdd = 'foo';
  const initialState = {
    goals: [],
    goal: goalTextToAdd,
    websocket,
  };

  const [state, effect] = actions.AddGoal(initialState);

  t.like(state.goals[0], {
    text: goalTextToAdd, completed: false,
  });
  t.is(state.goal, '');
  t.deepEqual(effect, effects.UpdateGoals({
    websocket,
    goals: state.goals,
  }));
});

test('can add multiple goals at once', (t) => {
  const goalTextToAdd = 'foo;bar;wow';
  const expectedGoals = ['foo', 'bar', 'wow'];
  const websocket = {}
  const initialState = {
    goals: [],
    websocket: websocket,
  };

  const [state, effect] = actions.AddMultipleGoals(initialState, goalTextToAdd);

  t.is(state.goals.length, expectedGoals.length);
  expectedGoals.forEach((text, index) => {
    t.like(state.goals[index], { text, completed: false });
  });

  t.deepEqual(effect, effects.UpdateGoals({
    websocket: websocket,
    goals: state.goals,
  }));
});


test('whitespace is trimmed when multiple goals added', (t) => {
  const goalTextToAdd = 'foo  ; bar ; wow \n ';
  const expectedGoals = ['foo', 'bar', 'wow'];
  const websocket = {}
  const initialState = {
    goals: [],
    websocket: websocket
  };

  const [state, effect] = actions.AddMultipleGoals(initialState, goalTextToAdd);

  t.is(state.goals.length, expectedGoals.length);
  expectedGoals.forEach((text, index) => {
    t.like(state.goals[index], { text, completed: false });
  });

  t.deepEqual(effect, effects.UpdateGoals({
    websocket: websocket,
    goals: state.goals,
  }));

});

test('empty goals do not get added when multiple goals added', (t) => {
  const goalTextToAdd = 'foo;;bar;  ;wow;;;\n;;\r\n;';
  const expectedGoals = ['foo', 'bar', 'wow'];
  const websocket = {}
  const initialState = {
    goals: [],
    websocket: websocket,
  };

  const [state, effect] = actions.AddMultipleGoals(initialState, goalTextToAdd);

  t.is(state.goals.length, expectedGoals.length);
  expectedGoals.forEach((text, index) => {
    t.like(state.goals[index], { text, completed: false });
  });

  t.deepEqual(effect, effects.UpdateGoals({
    websocket: websocket,
    goals: state.goals,
  }));

});

test('can complete goal', (t) => {
  const websocket = {};
  const goalTextToAdd = 'foo';
  const initialState = {
    goals: [
      makeGoal('foo'),
    ],
    websocket,
  };

  const [state, effect] = actions.CompleteGoal(initialState, {
    id: initialState.goals[0].id,
    completed: true,
  });

  t.like(state.goals[0], {
    text: goalTextToAdd, completed: true,
  });

  t.deepEqual(effect, effects.UpdateGoals({
    websocket,
    goals: state.goals,
  }));
});

test('can remove goal', (t) => {
  const websocket = {};
  const initialState = {
    goals: [
      makeGoal('foo'),
    ],
    websocket,
  };

  const [state, effect] = actions.RemoveGoal(initialState, initialState.goals[0].id);

  t.deepEqual(state.goals, []);

  t.deepEqual(effect, effects.UpdateGoals({
    websocket,
    goals: state.goals,
  }));
});

test('can rename goal', (t) => {
  const websocket = {};
  const renameGoalTo = 'bar';
  const initialState = {
    goals: [
      makeGoal('foo'),
    ],
    websocket,
  };

  const [state, effect] = actions.RenameGoal(initialState, {
    id: initialState.goals[0].id,
    value: renameGoalTo,
  });

  t.deepEqual(state.goals[0], {
    id: initialState.goals[0].id,
    text: renameGoalTo,
    completed: false,
  });

  t.deepEqual(effect, effects.UpdateGoals({
    websocket,
    goals: state.goals,
  }));
});

test('can prompt to rename goal', (t) => {
  const websocket = {};
  const initialState = {
    goals: [
      makeGoal('foo'),
    ],
    websocket,
  };

  const [state, effect] = actions.RenameGoalPrompt(initialState, {
    id: initialState.goals[0].id,
  });

  t.is(state, initialState);

  t.deepEqual(effect, effects.andThen({
    action: actions.PromptOpen,
    props: {
      text: 'Rename Goal',
      defaultValue: initialState.goals[0].text,
      OnValue: actions.RenameGoal,
      context: {
        id: initialState.goals[0].id,
      },
    },
  }));
});
