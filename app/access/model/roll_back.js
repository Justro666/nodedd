try {
  // Your queries here
  await Model1.findOneAndUpdate(...).session(session);
  await Model2.findOneAndUpdate(...).session(session);
  
  // If a query fails or a specific condition is met, throw an error to trigger a rollback
  if (someCondition) {
    throw new Error('Rollback the transaction');
  }
  
  // If all queries are successful, commit the transaction
  await session.commitTransaction();
} catch (error) {
  // Check if the error message indicates a rollback
  if (error.message === 'Rollback the transaction') {
    // Rollback the transaction
    await session.abortTransaction();
    console.error('Transaction aborted due to an error:', error.message);
  } else {
    // Handle other types of errors
    console.error('Other error:', error);
  }
} finally {
  // End the session
  session.endSession();
}
