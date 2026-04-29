using System;
using System.Collections.Generic;

namespace RestaurantMS.Domain.Entities
{
    public class ReviewReply
    {
        public long ReplyId { get; set; }
        public long ReviewId { get; set; }
        public Review Review { get; set; } = null!;
        public long StaffId { get; set; }
        public Staff Staff { get; set; } = null!;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
