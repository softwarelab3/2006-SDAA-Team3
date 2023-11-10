from .FilterStrategy import SurfaceCarparkFilter
from .FilterStrategy import BasementCarparkFilter
from .FilterStrategy import MultiStoreyCarparkFilter
from .FilterStrategy import ElectronicParkingFilter
from .FilterStrategy import CouponParkingFilter
from .FilterStrategy import NightParkingFilter
from abc import ABC, abstractmethod

class FilterFactory(ABC):
  @abstractmethod
  def createFilter(self,filter):
    pass

class CarParkFilter(FilterFactory):
    def createFilter(self, filter):
        if filter == "Multi-Storey Car Parks":
            return MultiStoreyCarparkFilter()
        if filter == "Surface Car Parks":
            return SurfaceCarparkFilter()
        if filter == "Basement Car Parks":
            return BasementCarparkFilter()
        if filter == "Coupon Parking":
            return CouponParkingFilter()
        if filter == "Electronic Parking System":
            return ElectronicParkingFilter()
        if filter == "Night Parking":
            return NightParkingFilter()
