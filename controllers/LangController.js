class LangController {
  changeLocale(req, res, next) {
    const locale = req.params.locale;

    res.cookie("nodeapp-locale", locale, {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 365 dias
    });

    // res.redirect(req.get("referer"));
    res.redirect('back');
  }
}

module.exports = LangController;
