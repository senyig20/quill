angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'Remixopolis 2019',
    })
    .constant('DASHBOARD', {
        UNVERIFIED: 'Başvuruna başlayabilmen için önce e-postandaki doğrulama linkine tıklaman lazım!',
        INCOMPLETE_TITLE: 'Başvurunu tamamlamayı unutma!',
        INCOMPLETE: 'Başvurunu 13 Mayıs 2019 23:59\'a kadar tamamlamazsan başvurun değerlendirmeye alınmayacak!',
        SUBMITTED_TITLE: 'Başvurunu aldık!',
        SUBMITTED: 'Başvurunun son kontrollerini yapıyoruz, en geç 24 saat içinde E-Postanı kontrol etmeyi unutma!',
        CLOSED_AND_INCOMPLETE_TITLE: 'Kayıtlar kapandı!',
        CLOSED_AND_INCOMPLETE: 'Vaktinde başvurunu tamamlamadığın için bu sene beraber olamayacağız.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: '13 Mayıs 2019 23:59\'a kadar teyit etmen gerekiyor.',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: 'Son teyit tarihi olan 13 Mayıs 2019 23:59 geçti.',
        ADMITTED_AND_CANNOT_CONFIRM: 'Kabul edilmene rağmen zamanında teyit etmedin.\nBu maalesef seni aramızda göremeyeceğiz anlamına geliyor.\nSeneye seni aramızda görme ümidiyle.',
        CONFIRMED_NOT_PAST_TITLE: 'Teyit formunu 13 Mayıs 2019 23:59\'a kadar düzenleyebilirsin',
        PAYMENT_TITLE: 'Ödemeni doğrulamamız lazım.',
        PAYMENT: 'Manuel bir kontrolden sonra ana sayfanda başvuru durumun gözükecek. Bir sıkıntı çıkarsa sana ulaşacağız.',
        DECLINED: 'Bu yıl gelemeyeceğini duyduğumuz için üzüldük. Umarız seneye gelebilirsin!',
    })
    .constant('TEAM', {
        NO_TEAM_REG_CLOSED: 'Unfortunately, it\'s too late to enter the event with a team.\nHowever, you can still form teams on your own before or during the event!',
    });
