
export class Gen {
    static objectCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static round(num) {
        return Math.round(num);
    }

    static isUserAdmin(user) {
        return user && user.role && (user.role === 'admin');
    }

    static isUserRealorOrAdmin(user) {
        return user && user.role && (user.role === 'manager' || user.role === 'admin');
    }

    static baseName(str) {
        var base = new String(str).substring(str.lastIndexOf('/') + 1);
        if(base.lastIndexOf(".") != -1)
            base = base.substring(0, base.lastIndexOf("."));
        return base;
    }

    static mergeArray(a1, a2) {
        const newArray = Gen.objectCopy(a1);
        a2.map(item => {
            if(newArray.indexOf(item)<0) {
                newArray.push(item);
            }
        });
        return newArray;
    }

    static getFormattedDate(date) {
        const year = date.split("-")[0];
        const month = Gen.getMonthFromNumber(date.split("-")[1]);

        return month + " " + year;
    }

    static getAvailableString(d1) {
        // d2 current date
        // d1 apartment date

        const d2 = Date.now();
        const d1parsed = Date.parse(d1);
        const diff = d1parsed - d2;
        if(diff<0) {
            return "available";
        } else {
            const month = d1.split("-")[1];
            return "available from " + Gen.getMonthFromNumber(month);
        }
    }

    static getMonthFromNumber(month) {
        switch(month) {
            case "01":
                return "Jan";
            case "02":
                return "Feb";
            case "03":
                return "Mar";
            case "04":
                return "Apr";
            case "05":
                return "May";
            case "06":
                return "June";
            case "07":
                return "July";
            case "08":
                return "Aug";
            case "09":
                return "Sep";
            case "10":
                return "Oct";
            case "11":
                return "Nov";
            case "12":
                return "Dec";
            default:
                return "-"
        }
    }
}