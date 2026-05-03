using System;
using System.Collections.Generic;

using RestaurantMS.Domain.Exceptions;
using RestaurantMS.Domain.Enums;

namespace RestaurantMS.Domain.Entities
{
    public class RestaurantTable
    {
        public int TableId { get; set; }
        public string TableNumber { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string? Location { get; set; }
        public TableStatus Status { get; set; }
        public ICollection<RestaurantOrder> Orders { get; set; } = new List<RestaurantOrder>();
        public ICollection<TableReservation> TableReservations { get; set; } = new List<TableReservation>();

        public void Reserve()
        {
            if (Status != TableStatus.AVAILABLE)
                throw new TableNotAvailableException(TableId);
            Status = TableStatus.RESERVED;
        }
        public void SetOccupied()  => Status = TableStatus.OCCUPIED;
        public void Free()         => Status = TableStatus.AVAILABLE;
        public void SetMaintenance() => Status = TableStatus.MAINTENANCE;
    }
}
