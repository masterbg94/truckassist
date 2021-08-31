/* GPS FILTER, GET FLAG */
export function getFlagOfFilter(flag: boolean, liveData: any, highlightingWords: any) {
  /* Truck Number */
  if (
    liveData.truckNumber
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Trailer Number */
  if (
    liveData.trailerNumber
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Status */
  if (
    liveData.dispatchBoardStatus
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Hardware ID */
  if (
    liveData.hardwareID
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Driver Name */
  if (
    liveData.driverName
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Location */
  if (
    liveData.location
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  /* Destination */
  if (
    liveData.destination
      .trim()
      .toLowerCase()
      .includes(highlightingWords[0].text.toLowerCase().trim()) &&
    !flag
  ) {
    flag = true;
  }

  return flag;
}

export function sortDataInTable(
  sortBy: string,
  tableData: any,
) {
  const gpsBeforeSorting = JSON.parse(localStorage.getItem('gpsBeforeSorting'));

  if (!gpsBeforeSorting) {
    localStorage.setItem('gpsBeforeSorting', JSON.stringify({ data: tableData }));
  }

  if (sortBy === 'truck') {
    tableData = gpsBeforeSorting.data;
    this.countTrailerSort = 0;
    this.countStatusSort = 0;
    this.countHardwareSorted = 0;
    this.countDriverSorted = 0;
    this.countSpeedSort = 0;

    if (this.countTruckSorted === 2) {
      tableData = gpsBeforeSorting.data;
      this.countTruckSorted = 0;
    } else {
      if (this.sortedByTruck) {
        tableData.sort((a, b) => {
          return parseFloat(a.truckNumber) - parseFloat(b.truckNumber);
        });
      } else {
        tableData.sort((a, b) => {
          return parseFloat(b.truckNumber) - parseFloat(a.truckNumber);
        });
      }
      this.countTruckSorted++;
      this.sortedByTruck = !this.sortedByTruck;
    }
  }

  if (sortBy === 'trailer') {
    tableData = gpsBeforeSorting.data;
    this.countTruckSorted = 0;
    this.countStatusSort = 0;
    this.countHardwareSorted = 0;
    this.countDriverSorted = 0;
    this.countSpeedSort = 0;

    if (this.countTrailerSort === 2) {
      tableData = gpsBeforeSorting.data;
      this.countTrailerSort = 0;
    } else {
      if (this.countTrailerSort) {
        tableData.sort(function (a, b) {
          if (a.trailerNumber > b.trailerNumber) {
            return -1;
          }
          if (a.trailerNumber < b.trailerNumber) {
            return 1;
          }
          return 0;
        });
      } else {
        tableData.sort(function (a, b) {
          if (a.trailerNumber < b.trailerNumber) {
            return -1;
          }
          if (a.trailerNumber > b.trailerNumber) {
            return 1;
          }
          return 0;
        });
      }
      this.countTrailerSort++;
      this.sortedByTrailer = !this.sortedByTrailer;
    }
  }

  if (sortBy === 'status') {
    tableData = gpsBeforeSorting.data;
    this.countTruckSorted = 0;
    this.countTrailerSort = 0;
    this.countHardwareSorted = 0;
    this.countDriverSorted = 0;
    this.countSpeedSort = 0;

    if (this.countStatusSort === 2) {
      tableData = gpsBeforeSorting.data;
      this.countStatusSort = 0;
    } else {
      if (this.countStatusSort) {
        tableData.sort(function (a, b) {
          if (a.dispatchBoardStatus > b.dispatchBoardStatus) {
            return -1;
          }
          if (a.dispatchBoardStatus < b.dispatchBoardStatus) {
            return 1;
          }
          return 0;
        });
      } else {
        tableData.sort(function (a, b) {
          if (a.dispatchBoardStatus < b.dispatchBoardStatus) {
            return -1;
          }
          if (a.dispatchBoardStatus > b.dispatchBoardStatus) {
            return 1;
          }
          return 0;
        });
      }
      this.countStatusSort++;
      this.sortedByStatus = !this.sortedByStatus;
    }
  }

  if (sortBy === 'driver') {
    this.countTruckSorted = 0;
    this.countTrailerSort = 0;
    this.countStatusSort = 0;
    this.countHardwareSorted = 0;
    this.countSpeedSort = 0;

    if (this.countDriverSorted === 2) {
      tableData = gpsBeforeSorting.data;
      this.countDriverSorted = 0;
    } else {
      if (this.sortedByDriver) {
        tableData.sort(function (a, b) {
          if (a.driverName > b.driverName) {
            return -1;
          }
          if (a.driverName < b.driverName) {
            return 1;
          }
          return 0;
        });
      } else {
        tableData.sort(function (a, b) {
          if (a.driverName < b.driverName) {
            return -1;
          }
          if (a.driverName > b.driverName) {
            return 1;
          }
          return 0;
        });
      }
      this.countDriverSorted++;
      this.sortedByDriver = !this.sortedByDriver;
    }
  }

  if (sortBy === 'hardware') {
    tableData = gpsBeforeSorting.data;
    this.countTruckSorted = 0;
    this.countTrailerSort = 0;
    this.countStatusSort = 0;
    this.countDriverSorted = 0;
    this.countSpeedSort = 0;

    if (this.countHardwareSorted === 2) {
      tableData = gpsBeforeSorting.data;
      this.countHardwareSorted = 0;
    } else {
      if (this.sortedByHardware) {
        tableData.sort((a, b) => {
          return parseFloat(a.hardwareID) - parseFloat(b.hardwareID);
        });
      } else {
        tableData.sort((a, b) => {
          return parseFloat(b.hardwareID) - parseFloat(a.hardwareID);
        });
      }
      this.countHardwareSorted++;
      this.sortedByHardware = !this.sortedByHardware;
    }
  }

  if (sortBy === 'speed') {
    tableData = gpsBeforeSorting.data;
    this.countTruckSorted = 0;
    this.countTrailerSort = 0;
    this.countHardwareSorted = 0;
    this.countStatusSort = 0;
    this.countDriverSorted = 0;

    if (this.countSpeedSort === 2) {
      tableData = gpsBeforeSorting.data;
      this.countSpeedSort = 0;
    } else {
      if (this.countSpeedSort) {
        tableData.sort(function (a, b) {
          if (a.speed > b.speed) {
            return -1;
          }
          if (a.speed < b.speed) {
            return 1;
          }
          return 0;
        });
      } else {
        tableData.sort(function (a, b) {
          if (a.speed < b.speed) {
            return -1;
          }
          if (a.speed > b.speed) {
            return 1;
          }
          return 0;
        });
      }
      this.countSpeedSort++;
    }
  }
}
