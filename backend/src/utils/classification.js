function getClassification(gpa) {
    if (gpa === null || gpa === undefined) {
        return { vn: "Chưa có", en: "N/A" };
    }
    if (gpa >= 3.6) return { vn: "Xuất sắc", en: "Excellent" };
    if (gpa >= 3.2) return { vn: "Giỏi", en: "Very Good" };
    if (gpa >= 2.5) return { vn: "Khá", en: "Good" };
    if (gpa >= 2.0) return { vn: "Trung bình", en: "Average" };
    return { vn: "Yếu", en: "Poor" };
}

module.exports = { getClassification };
