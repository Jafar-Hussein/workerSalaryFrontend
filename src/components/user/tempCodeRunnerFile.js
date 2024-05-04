 const handleSelectChange = (event, isCheckIn) => {
    const value = event.target.value;
    if (isCheckIn) {
      setSelectedCheckIn(value);
    } else {
      setSelectedCheckOut(value);
    }
  };