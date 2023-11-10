from abc import ABC, abstractmethod

class FilterStrategy(ABC):
  @abstractmethod
  def filter(self):
    pass

class SurfaceCarparkFilter(FilterStrategy):
  def filter(self):
    
    return "car_park_type"

class MultiStoreyCarparkFilter(FilterStrategy):
  def filter(self):
    return "car_park_type"

class BasementCarparkFilter(FilterStrategy):
  def filter(self):
    return "car_park_type"

class ElectronicParkingFilter(FilterStrategy):
  def filter(self):
    return "type_of_parking_system"

class CouponParkingFilter(FilterStrategy):
  def filter(self):
    return "type_of_parking_system"

class NightParkingFilter(FilterStrategy):
  def filter(self):
    return "night_parking"


